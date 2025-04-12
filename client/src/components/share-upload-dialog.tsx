import { Share2Icon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

export default function ShareUploadDialog({ url }: { url: string }) {
  // TODO: Remove hardcoded URL
  const link = process.env.REACT_APP_UPLOAD_URL + url;

  // TODO: Add QR code

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2Icon /> Share Upload Link
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your upload link</DialogTitle>
          <DialogDescription>
            Share the QR code or the link below with your guests, allowing them
            to upload their images
          </DialogDescription>
        </DialogHeader>

        <div className='flex '>
          <Input readOnly value={link} className='rounded-r-none' />
          <Button
            onClick={() => navigator.clipboard.writeText(link)}
            className='rounded-l-none'
          >
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
