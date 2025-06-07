import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    const passwords = localStorage.getItem('passwords');
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }
  }, []);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard!', {
      position: 'top-right',
      autoClose: 3000,
      theme: 'dark',
    });
  };

  const showPassword = () => {
    if (ref.current.src.includes('icons/eyecross.png')) {
      ref.current.src = 'icons/eye.png';
      passwordRef.current.type = 'password';
    } else {
      ref.current.src = 'icons/eyecross.png';
      passwordRef.current.type = 'text';
    }
  };

  const savePassword = () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const updatedPasswords = [...passwordArray, { ...form, id: uuidv4() }];
      setPasswordArray(updatedPasswords);
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setForm({ site: '', username: '', password: '' });
      toast('Password saved!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    } else {
      toast('Error: Fill all fields properly!');
    }
  };

  const deletePassword = (id) => {
    if (confirm('Do you really want to delete this password?')) {
      const updated = passwordArray.filter((item) => item.id !== id);
      setPasswordArray(updated);
      localStorage.setItem('passwords', JSON.stringify(updated));
      toast('Password Deleted!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    }
  };

  const editPassword = (id) => {
    const toEdit = passwordArray.find((item) => item.id === id);
    if (!toEdit) return;

    // Set form with values to edit
    setForm({ site: toEdit.site, username: toEdit.username, password: toEdit.password, id: toEdit.id });

    // Remove the item silently from the list (without confirmation)
    const updated = passwordArray.filter((item) => item.id !== id);
    setPasswordArray(updated);
    localStorage.setItem('passwords', JSON.stringify(updated));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="px-4 py-6 md:px-8 max-w-5xl mx-auto min-h-[88.2vh]">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>Secure
          <span className="text-green-500">LY/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">Secure Password Storage</p>

        <div className="flex flex-col gap-6 mt-6">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 px-4 py-2"
            type="text"
            name="site"
          />

          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 px-4 py-2 flex-1"
              type="text"
              name="username"
            />

            <div className="relative flex-1">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 px-4 py-2 w-full"
                type="password"
                name="password"
              />
              <span className="absolute right-2 top-2 cursor-pointer" onClick={showPassword}>
                <img ref={ref} className="p-1" width={26} src="icons/eye.png" alt="eye" />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-6 py-2 border border-green-900 w-fit mx-auto"
          >
            <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" style={{ width: 24, height: 24 }}></lord-icon>
            <span className="font-semibold">Save</span>
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Passwords</h2>
          {passwordArray.length === 0 ? (
            <p>No passwords to show</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="py-2 px-4">Site</th>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Password</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100">
                  {passwordArray.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <a href={item.site} target="_blank" rel="noopener noreferrer">
                            {item.site}
                          </a>
                          <div onClick={() => copyText(item.site)} className="cursor-pointer">
                            <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" style={{ width: 25, height: 25 }}></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <span>{item.username}</span>
                          <div onClick={() => copyText(item.username)} className="cursor-pointer">
                            <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" style={{ width: 25, height: 25 }}></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <span>{item.password}</span>
                          <div onClick={() => copyText(item.password)} className="cursor-pointer">
                            <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" style={{ width: 25, height: 25 }}></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <span className="cursor-pointer" onClick={() => editPassword(item.id)}>
                            <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: 25, height: 25 }}></lord-icon>
                          </span>
                          <span className="cursor-pointer" onClick={() => deletePassword(item.id)}>
                            <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: 25, height: 25 }}></lord-icon>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
