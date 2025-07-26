export default function FilesGrid({ data }) {
  if (data.length == 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">
          Sorry, no files available right now!
        </p>
        <p className="text-sm opacity-75">
          Start uploading and share with everyone.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {data.map((file, index) => (
        <div
          key={index}
          className="rounded-2xl bg-gradient-to-b from-[#222] to-purple-900/60 p-4 shadow-lg border border-white/10 backdrop-blur-md text-white"
        >
          <div className="overflow-hidden rounded-xl mb-4">
            <iframe
              src={file.filelink}
              className="w-full h-48 rounded-lg border border-white/10"
            />
          </div>
          <h2
            className="text-lg font-bold tracking-wide mb-1 truncate w-full"
            title={file.filename}
          >
            {file.filename}
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-white/30" />
              <span className="text-sm text-white/80">{file.uploaded_by}</span>
            </div>
            <div className="text-purple-300 text-sm font-medium px-2 py-1 bg-white/5 rounded-md border border-purple-500/20">
              Open
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
