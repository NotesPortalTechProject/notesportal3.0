import FileCard from "../file-card";

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
        <FileCard file={file} key={index}/>
      ))}
    </div>
  );
}
