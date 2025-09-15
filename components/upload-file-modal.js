'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LoadingDots from './loadingDots';
import { usePathname } from 'next/navigation';
import { revalidatePathCustom } from '@/actions/other-actions';


export default function UploadFileModal({ children, id,subjectlist}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [subjectcode, setSubjectcode] = useState('');
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState([]);
  const [success, setSuccess] = useState();


  useEffect(() => {
    setIsMounted(true);
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError([]);
    setSuccess('');
    setLoading(true);
    let tempErrors = [];

    if (!subjectcode.trim()) tempErrors.push('Subject code is required');
    if (!filename.trim()) tempErrors.push('Filename is required');
    if (!description.trim()) tempErrors.push('Description is required');
    if (description.length < 10) tempErrors.push('Please write a larger description');
    if (!file) tempErrors.push('Please select a file');
    if (!/^[A-Za-z]+$/.test(subjectcode.trim())) tempErrors.push('Subject code can contain letters only');

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    if (file && !allowedTypes.includes(file.type)) {
      tempErrors.push('Only PDF, DOC, DOCX, PPT, and PPTX files are allowed');
    }

    if (tempErrors.length > 0) {
      setError(tempErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("scode", subjectcode);
    formData.append("filename", filename);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("userid", id);

    const res = await fetch("/api/uploadfile", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok && data.success) {
      setSuccess("File Uploaded Successfully");
      setSubjectcode('');
      setDescription('');
      setFilename('');
      setFile(null);
      await revalidatePathCustom('/')
    } else {
      const {code,text,details} = data.error || {};
      if(text=='Duplicate! file already exists'||text=='No file provided'){
        setError([`${text}`])
        return
      }
      setError([`Oops! something went wrong, please try again later`])
    }
  }

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="fixed top-1/2 left-1/2 z-50 w-[90vw] sm:w-[420px] max-w-[95vw] p-6 rounded-2xl
        backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
        border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.1)] text-white
        -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-300">Upload File</h2>
          <button
            onClick={() => {setIsOpen(false);()=>setError('');()=>setSuccess('');}}
            className="text-xs sm:text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm sm:text-base">
          <input type="text" name="id" value={id} readOnly hidden />

          <input
            type="text"
            name="subjectcode"
            list="subjects"
            value={subjectcode}
            onChange={(e) => setSubjectcode(e.target.value)}
            placeholder="Enter subject code"
            required
            className="bg-white/5 border border-purple-500/20 rounded-md px-3 py-2 text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <datalist id="subjects">
            {subjectlist.map((subj, idx) => (
              <option key={idx} value={subj} />
            ))}
          </datalist>

          <input
            type="file"
            name="file"
            required
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm sm:text-base text-white file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
          />

          <input
            type="text"
            name="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter a suitable filename"
            required
            className="bg-white/5 border border-purple-500/20 rounded-md px-3 py-2 text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a suitable description"
            required
            className="bg-white/5 border border-purple-500/20 rounded-md px-3 py-2 text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold text-sm sm:text-base transition"
            disabled={loading}
          >
            {loading ? <LoadingDots text='Uploading' /> : "Submit"}
          </button>

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-md p-2 mt-2 text-green-400 text-sm">
              {success}
            </div>
          )}

          {errors?.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-2 mt-2 text-red-400 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {errors?.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="contents">
        {children}
      </button>
      {isMounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
