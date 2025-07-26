import FileCard from "../file-card";

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
                    <FileCard file={file} key={index}/>
                ))}
            </div>
        </>
    );
}