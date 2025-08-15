import FileCard from "../file-card";

export default function RecentFilesGrid({ data, weeks, userid, src }) {
  if (data.length == 0) {
    return (
      <>
        <p>No recent files found</p>
      </>
    );
  }
  return (
    <>
      <div>
        <p>files uploaded from last {weeks} weeks</p>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {data.map((file, index) => (
          // <FileCard file={file} key={index} userid={userid} src={src} />
          <p>{file.filename}</p>
        ))}
      </div>
    </>
  );
}
