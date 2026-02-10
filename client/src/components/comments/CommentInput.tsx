// import { useState } from "react";
// import type { Comment } from "../../utils/types/comment.interface";

// const CommentInput = () => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedDescription, setEditedDescription] = useState("");
//     const [description, setDescription] = useState("");

//     const handleEditToggle = () => {
//         setIsEditing(!isEditing);
//         setEditedDescription(description); // Reset edited description on cancel
//     };
//     const handleSave = () => {
//         setDescription(editedDescription);
//         setIsEditing(false);
//         // Here you would typically also call a service to update the comment on the server
//     }

//     return (    
//     <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
//         <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{
//                 width: '40px',
//                 height: '40px',
//                 borderRadius: '50%',
//                 backgroundColor: '#1976d2',
//                 color: '#fff',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontWeight: 'bold',
//                 fontSize: '18px'
//             }}>
//                 {comment.userCreator.profileImage ? (
//               <img src={comment.userCreator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//             ) : (
//               comment.userCreator.username.charAt(0).toUpperCase()
//             )}
//             </div>
//             <div style={{ fontWeight: 'bold' }}>
//                 {comment.userCreator.username}
//             </div>
//         </div>
//         {isEditing ? (
//             <textarea
//                 style={{ width: '100%', minHeight: '80px' }}
//                 value={editedDescription}
//                 onChange={(e) => setEditedDescription(e.target.value)}
//             />
//         ) : (
//             <div>{description}</div>
//         )}
//         <div style={{ marginTop: '8px' }}>
//             {isEditing ? (
//                 <button onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px' }}>
//                     Save
//                 </button>
//             ) : (
//                 <button onClick={handleEditToggle} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: '4px' }}>
//                     Edit
//                 </button>
//             )}
//         </div>
//     </div>
//     );
// }
// export default CommentInput;