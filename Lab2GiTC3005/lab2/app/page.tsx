"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

type Item = {
  id: string;
  inputText: string;
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    setItems(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        inputText: doc.data().inputText,
      }))
    );
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    const value = inputText.trim();
    if (!value) return;

    await addDoc(collection(db, "items"), { inputText: value });
    setInputText("");
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    await deleteDoc(doc(db, "items", id));
    fetchItems();
  };

  const handleEdit = async (id: string) => {
    const value = editText.trim();
    if (!value) return;

    await updateDoc(doc(db, "items", id), { inputText: value });
    setEditingId(null);
    setEditText("");
    fetchItems();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto flex max-w-xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-center">NextJS Firebase</h1>

        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe algo"
          />
          <button
            className="rounded-lg border border-blue-500 bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600"
            onClick={handleAdd}
          >
            Agregar
          </button>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
            >
              {editingId === item.id ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded border border-slate-300 px-2 py-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    className="rounded bg-green-500 px-2 py-1 text-sm text-white"
                    onClick={() => handleEdit(item.id)}
                  >
                    Save
                  </button>
                  <button
                    className="rounded bg-slate-300 px-2 py-1 text-sm"
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="break-all">{item.inputText}</span>
                  <div className="flex gap-2">
                    <button
                      className="rounded border border-yellow-500 bg-yellow-500 px-2 py-1 text-sm text-white"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditText(item.inputText);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded border border-red-500 bg-red-500 px-2 py-1 text-sm text-white"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}