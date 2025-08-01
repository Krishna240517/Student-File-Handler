import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./cssFiles/GroupDetails.css";
import UploadFileForm from "./uploadFileForm.jsx";

const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null); //todo: represents the specific group
    const [members, setMembers] = useState([]); //todo: represents the members of that group [array]
    const [files, setFiles] = useState([]); //todo: represents the files of that group [array]
    const [activeTab, setActiveTab] = useState("members");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const groupRes = await axios.get(`http://localhost:3000/api/v1/group/specificGroup/${groupId}`, {
                    withCredentials: true,
                })

                const group = groupRes.data;
                setGroup(group);
                setMembers(group.members);
                setFiles(group.files);
            } catch (error) {
                console.error("Error loading group view:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [groupId]);
    
    const handleFileUploadSuccess = (newFile) => {
        setFiles((prevFiles) => [newFile, ...prevFiles]);
    };


    if (loading) return <p>Loading group...</p>;
    if (!group) return <p>Group not found</p>;

    return (
        <div className="group-view">
            <header className="group-header">
                <h1>{group.name}</h1>
                <p>Created by: {group.createdBy.name}</p>
            </header>

            <div className="group-tabs">
                <button onClick={() => setActiveTab("files")} className={activeTab === "files" ? "active" : ""}>
                    Files
                </button>
                <button onClick={() => setActiveTab("members")} className={activeTab === "members" ? "active" : ""}>
                    Members
                </button>
            </div>

            <div className="group-content">
                {activeTab === "files" ? (
                    <>
                        <UploadFileForm groupId={groupId} onUploadSuccess={handleFileUploadSuccess} />
                        <FileCard files={files} />
                    </>
                ) : (
                    <MemberCard members={members} />
                )}
            </div>
        </div>
    );
};

const MemberCard = ({ members }) => {
    return (
        <ul className="member-list">
            {members.map((m) => (
                <li key={m._id}>
                    <p><strong>{m.name}</strong> — {m.email}</p>
                </li>
            ))}
        </ul>
    );
};


const FileCard = ({ files }) => {
    const { groupId } = useParams();
    const handleDownload = async(fileId) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/api/v1/group/sign/${groupId}/${fileId}`,
                { withCredentials: true }
            );
            window.open(res.data.url,"_blank");
        } catch (err) {
            alert("Failed to get download link");
            console.error("Download error:", err);
        }
    };


    if (!files || files.length === 0) return <p>No files uploaded yet.</p>;

    return (
        <div className="file-list">
            {files.map((file) => (
                <div className="file-card" key={file._id}>
                    <p><strong>{file.filename}</strong></p>
                    <button onClick={() => handleDownload(file._id)}>Download</button>
                </div>
            ))}
        </div>
    );
};
export default GroupDetails;