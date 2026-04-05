
import ReaderView from './ReaderView';

interface ReaderViewWrapperProps {
  contentId: string;
}

export default function ReaderViewWrapper({ contentId }: ReaderViewWrapperProps) {
  return <ReaderView contentId={contentId} />;
}
