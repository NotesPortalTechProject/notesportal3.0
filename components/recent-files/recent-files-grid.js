export default function RecentFilesGrid({ data, weeks}) {
    if(data.length==0){
        return(
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
            <div className="grid grid-cols-4 gap-4 p-4">
                {data.map((file, index) => (
                    <div key={index} className="border-2 border-black">
                        <iframe src={file.filelink} />
                        <p>{file.filename}</p>
                        <p>{file.uploaded_by}</p>
                    </div>
                ))}
            </div>
        </>
    );
}