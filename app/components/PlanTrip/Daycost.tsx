export default function DayCost({ cost }: { cost: string }) {
  return (
    <div className="mt-4 border-t border-gray-200 pt-3">
      <p className="text-gray-900 font-semibold text-lg">
        💰 <span className="text-gray-800 font-medium">Total Cost:</span>{" "}
        
        <span className="text-gray-700 font-normal">{cost}</span>
      </p>
    </div>
  );
}
