export default function FollowRequestCard({ request, onAccept, onReject }) {
  return (
    <div className="bg-[#141022]/70 p-4 rounded-xl flex justify-between items-center">
      <div>
        <h2 className="font-semibold">{request.name}</h2>
        <p className="text-gray-400 text-sm">{request.email}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(request._id)}
          className="bg-green-500 px-3 py-1 rounded-lg hover:bg-green-600 transition"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(request._id)}
          className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
