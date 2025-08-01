import { useState } from "react";
import axios from "axios";

const UploadFileForm = ({ groupId, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("")

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus("");
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);


        try {
            setStatus("UPLOADING....");
            const res = await axios.post(`http://localhost:3000/api/v1/group/upload/${groupId}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus("Upload Successful");
            setFile(null);
            onUploadSuccess && onUploadSuccess(res.data.file);
        } catch (err) {
            const msg =
                err.response?.data?.msg || "Upload failed. Try again.";
            setStatus(msg);
        }
    }
    return (
        <div className="upload-form">
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}

export default UploadFileForm;