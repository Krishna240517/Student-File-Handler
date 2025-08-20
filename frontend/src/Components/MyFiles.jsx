
// import { motion } from "framer-motion";
const files = [
  { name: "mybadge.png", group: "WEB DEV" },
  { name: "notes.pdf", group: "PYQS" },
];

export default function MyFiles() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">
        My Groups / <span className="text-gray-400">My Files</span>
      </h1>

      <div className="flex flex-col gap-6">
        {files.map((file, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex justify-between items-center p-4 rounded-lg bg-black/40 border border-gray-800 backdrop-blur-lg"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm">Group: {file.group}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-1 rounded bg-gray-700 hover:bg-blue-600">View</button>
              <button className="px-4 py-1 rounded bg-gray-700 hover:bg-green-600">Download</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
