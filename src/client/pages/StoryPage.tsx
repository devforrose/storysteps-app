import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReaderViewWrapper from '@/components/Reader/ReaderViewWrapper';

export default function StoryPage() {
  const { contentId } = useParams<{ contentId: string }>();

  return (
    <div>
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            to="/reader"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-semibold transition-colors"
          >
            <span>&larr;</span>
            Back to Library
          </Link>
        </div>
      </div>

      {/* Reader Content */}
      <ReaderViewWrapper contentId={contentId!} />
    </div>
  );
}
