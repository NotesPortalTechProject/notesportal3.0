import ChatWithPdf from "@/components/chatwithpdf/chatwithpdf";

export default function Page({params}){
    const userid = params.id;
    return <ChatWithPdf userId={userid}/>
}