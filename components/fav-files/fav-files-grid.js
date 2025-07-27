import FileCard from "../file-card";

export default function FavFilesGrid({ data, userid, src }) {
    if (data.length == 0) {
        return (
            <>
                <p>No favorites added</p>
                <p>Add your favorite files to keep them separated and highlighted from others.</p>
            </>
        );
    }
    return (
        <>
            <div className="grid grid-cols-4 gap-4 p-4">
                {data.map((file, index) => (
                    <FileCard file={file} key={index} userid={userid} src={src} />
                ))}
            </div>
        </>
    );
}