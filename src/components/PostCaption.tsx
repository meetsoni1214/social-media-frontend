interface PostCaptionProps {
  title: string;
  content: string;
  className?: string;
}

export function PostCaption({
  title,
  content,
  className = '',
}: PostCaptionProps) {
  return (
    <div className={className}>
      <h3 className="text-base font-semibold text-gray-800 mb-2">Caption</h3>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <p className="font-medium text-gray-900 mb-2 text-sm">{title}</p>
        <p className="text-gray-700 whitespace-pre-wrap text-sm">{content}</p>
      </div>
    </div>
  );
}
