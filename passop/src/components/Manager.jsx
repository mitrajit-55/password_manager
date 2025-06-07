import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const response = await fetch("https://password-manager-2-8tx4.onrender.com");
                const data = await response.json();
                setPasswordArray(data);
            } catch (error) {
                console.error("Error fetching passwords:", error);
                toast.error("Failed to fetch passwords from server");
            }
        };
        fetchPasswords();
    }, []);

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast('Copied to clipboard!', { theme: "dark" });
    };

    const showPassword = () => {
        if (ref.current.src.includes("eyecross.png")) {
            ref.current.src = "icons/eye.png";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "icons/eyecross.png";
            passwordRef.current.type = "text";
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            try {
                if (isEditMode) {
                    const res = await fetch("https://password-manager-2-8tx4.onrender.com", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ ...form, _id: editId })
                    });
                    const result = await res.json();
                    if (result.success) {
                        const updatedArray = passwordArray.map(item =>
                            item._id === editId ? { ...form, _id: editId } : item
                        );
                        setPasswordArray(updatedArray);
                        toast.success("Password updated!");
                    } else {
                        toast.error("Failed to update password.");
                    }
                } else {
                    const res = await fetch("https://password-manager-2-8tx4.onrender.com", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(form)
                    });
                    const result = await res.json();
                    if (result.success) {
                        const newPassword = { ...form, _id: result.result.insertedId };
                        setPasswordArray([...passwordArray, newPassword]);
                        toast.success("Password saved!");
                    } else {
                        toast.error("Failed to save password.");
                    }
                }

                // Reset form
                setForm({ site: "", username: "", password: "" });
                setIsEditMode(false);
                setEditId(null);

            } catch (error) {
                console.error(error);
                toast.error(isEditMode ? "Error updating password." : "Error saving password.");
            }
        } else {
            toast.error("Please fill all fields properly!");
        }
    };

    const deletePassword = async (_id) => {
        const confirmDelete = confirm("Do you really want to delete this password?");
        if (!confirmDelete) return;

        try {
            const res = await fetch("https://password-manager-2-8tx4.onrender.com", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id })
            });
            const result = await res.json();
            if (result.success) {
                setPasswordArray(passwordArray.filter(item => item._id !== _id));
                toast.success("Password Deleted!");
            } else {
                toast.error("Failed to delete password.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting password.");
        }
    };

    const editPassword = (_id) => {
        const selected = passwordArray.find(p => p._id === _id);
        if (selected) {
            setForm({ site: selected.site, username: selected.username, password: selected.password });
            setIsEditMode(true);
            setEditId(_id);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer theme="light" position="top-right" autoClose={3000} />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>
            <div className="p-3 md:mycontainer min-h-[88.2vh]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>Secure
                    <span className='text-green-500'>LY/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900'>
                        {isEditMode ? "Update" : "Save"}
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && (
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item) => (
                                    <tr key={item._id}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <span className='cursor-pointer ml-2' onClick={() => copyText(item.site)}><lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon></span>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.username}</span>
                                                <span className='cursor-pointer ml-2' onClick={() => copyText(item.username)}><lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon></span>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.password}</span>
                                                <span className='cursor-pointer ml-2' onClick={() => copyText(item.password)}><lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon></span>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => editPassword(item._id)}> <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon></span>
                                            <span className='cursor-pointer mx-1' onClick={() => deletePassword(item._id)}><lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon></span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;
