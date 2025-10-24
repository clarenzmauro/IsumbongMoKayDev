export default function DeveloperCornerPage({ params }: { params: { id: string } }) {
  // You can use params.id to get the dynamic ID
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Developer Corner Problem ID: {params.id}</h1>
      {/* You can later load problem details here */}
    </div>
  );
}