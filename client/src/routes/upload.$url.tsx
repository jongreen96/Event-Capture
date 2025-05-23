import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';
import imageCompression from 'browser-image-compression';
import { OTPInput } from 'input-otp';
import { Loader2Icon, UploadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { uploadPlan } from '../../../src/utils/types';

export const Route = createFileRoute('/upload/$url')({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const plan = await fetch(`/api/upload/${params.url}`);
    if (!plan.ok) throw redirect({ to: '/' });

    return plan.json();
  },
});

function RouteComponent() {
  const { planId, eventname, pauseduploads, hasPin } =
    Route.useRouteContext() as uploadPlan;

  const [files, setFiles] = useState<FileList | null>(null);
  const [guest, setGuest] = useState<string>('');
  const [pin, setPin] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!files) {
      setErrorMessage('Please select files to upload');
      return;
    } else if (!guest) {
      setErrorMessage('Please enter your name');
      return;
    } else if (hasPin && !pin) {
      setErrorMessage('Please enter the pin');
      return;
    } else if (pauseduploads) {
      setErrorMessage('Uploads are paused');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    const fileMetadata = Array.from(files).map((file) => ({
      name: `${planId}/${guest}/${file.name}`,
      type: file.type,
      size: file.size,
    }));

    const res = await fetch(`/api/upload/${planId}/presign`, {
      method: 'POST',
      body: JSON.stringify({
        fileMetadata,
        pin,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 401) {
      setErrorMessage('Incorrect Pin');
      setIsUploading(false);
      return;
    } else if (res.status === 403) {
      setErrorMessage('Uploads are paused');
      setIsUploading(false);
      return;
    } else if (res.status === 409) {
      setErrorMessage('Storage limit exceeded');
      setIsUploading(false);
      return;
    }

    const presignedUrls = (await res.json()) as {
      url: string;
      thumbUrl: string;
      fileName: string;
    }[];

    let completedUploads = 0;
    await Promise.all(
      Array.from(files).map(async (file, index) => {
        const { url, thumbUrl, fileName } = presignedUrls[index];

        const thumbnail = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 200,
        });

        // Upload the file to R2
        await fetch(url, {
          method: 'PUT',
          body: file,
        });

        await fetch(thumbUrl, {
          method: 'PUT',
          body: thumbnail,
        });

        await fetch(`/api/upload/${planId}/add-image`, {
          method: 'POST',
          body: JSON.stringify({
            guest,
            size: file.size,
            imagename: fileName,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        completedUploads += 1;
        setUploadProgress((completedUploads / files.length) * 100);
      })
    );

    setCompleted(true);
    setIsUploading(false);
  };

  return (
    <main className='h-svh flex items-center justify-center'>
      <Card className='w-full sm:w-72 overflow-hidden shadow-none border-none'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            {eventname}
          </CardTitle>
          <CardDescription className='text-center'>
            Upload your photos here
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex flex-col items-center gap-4'
          >
            <ImageInput
              files={files}
              setFiles={setFiles}
              disabled={completed || pauseduploads}
            />

            <ImageList files={files} />

            {hasPin && (
              <div className='flex w-full items-center justify-between'>
                <Label htmlFor='pin'>Pin:</Label>
                <OTPInput
                  maxLength={4}
                  name='pin'
                  value={pin}
                  onChange={setPin}
                  id='pin'
                  disabled={completed || pauseduploads}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </OTPInput>
              </div>
            )}

            <div className='flex w-full items-center justify-between'>
              <Label htmlFor='name'>Name:</Label>
              <Input
                type='text'
                placeholder='John Doe'
                id='name'
                name='name'
                className='w-40 text-ellipsis'
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                disabled={completed || pauseduploads}
              />
            </div>

            {isUploading && (
              <Progress className='w-full' value={uploadProgress} max={100} />
            )}

            <Button
              className={cn('w-full', completed && 'disabled:opacity-100')}
              type='submit'
              disabled={isUploading || completed || pauseduploads}
            >
              {pauseduploads ? (
                'Uploads paused by admin'
              ) : completed ? (
                'Completed'
              ) : isUploading ? (
                <p className='flex items-center gap-2'>
                  <Loader2Icon className='h-4 w-4 animate-spin' />
                  Uploading...
                </p>
              ) : (
                'Upload'
              )}
            </Button>
          </form>

          {errorMessage && (
            <p className='mt-4 text-destructive text-center'>{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function ImageInput({
  files,
  setFiles,
  disabled,
}: {
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  disabled: boolean;
}) {
  const MAX_FILES = 250;

  const handleFileClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFilesArray = Array.from(e.target.files);

    setFiles((prevFiles) => {
      if (!prevFiles) {
        if (newFilesArray.length > MAX_FILES) {
          alert(`You can only upload ${MAX_FILES} files at a time`);
          return new DataTransfer().files;
        }

        return newFilesArray as unknown as FileList;
      }

      const prevFilesArray = Array.from(prevFiles);

      // Merge the new files with the existing ones, but filter out duplicates
      const combinedFiles = [
        ...prevFilesArray,
        ...newFilesArray.filter(
          (newFile) =>
            !prevFilesArray.some(
              (prevFile) =>
                prevFile.name === newFile.name &&
                prevFile.size === newFile.size &&
                prevFile.lastModified === newFile.lastModified
            )
        ),
      ];

      if (combinedFiles.length > MAX_FILES) {
        alert(`You can only upload ${MAX_FILES} files at a time`);
        return prevFiles || new DataTransfer().files;
      }

      // Create a new FileList from the combined array
      const dataTransfer = new DataTransfer();
      combinedFiles.forEach((file) => dataTransfer.items.add(file));

      return dataTransfer.files;
    });
  };
  return (
    <>
      <Input
        id='fileInput'
        type='file'
        name='files'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />

      <Button
        type='button'
        variant='outline'
        onClick={handleFileClick}
        className='flex h-32 w-full flex-col gap-2 border-dashed'
        disabled={disabled}
      >
        <UploadIcon className='h-8 w-8' />
        {files?.length ? (
          <>
            <p>Add More Photos</p>
            <p className='text-sm text-gray-500'>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <p className='text-sm text-gray-500/50'>(max 250)</p>
          </>
        ) : (
          <>
            <p>Upload Photos</p>
            <p className='text-sm text-gray-500/50'>(max 250)</p>
          </>
        )}
      </Button>
    </>
  );
}

function ImageList({ files }: { files: FileList | null }) {
  const images = useMemo(() => {
    if (!files) return null;

    return Array.from(files)
      .slice(0, 6)
      .map((file, index) => (
        <div
          key={index}
          className='relative z-10'
          style={{ marginLeft: index === 0 ? 0 : '-3rem' }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className='h-16 w-16 rounded-md object-cover'
          />
        </div>
      ));
  }, [files]);

  if (!files) return null;

  return (
    <div className='relative flex items-center gap-2'>
      {images}
      {files.length > 6 && (
        <span className='text-sm text-gray-500'>+{files.length - 6} more</span>
      )}
    </div>
  );
}
