import Link from "next/link";

export default function TestImages() {
    const paths = [
        // Test the new proxy route
        "/api/images/assets/images/header/image-slide-4.jpg",
        "/api/images/theme/images/logo-gkj-tab.png",
        // Test direct file access again just in case (original failing one)
        "http://localhost/gkjtangerang/assets/images/header/image-slide-4.jpg"
    ];

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Image Path Tester (Proxy)</h1>
            <p className="mb-4">Testing new internal image proxy:</p>

            <div className="space-y-8">
                {paths.map((url, idx) => (
                    <div key={idx} className="border p-4 rounded">
                        <p className="mb-2 font-mono text-sm bg-gray-100 p-1">{url}</p>
                        <img src={url} alt={`Test ${idx + 1}`} className="h-40 object-cover border border-red-500" />
                        <div className="mt-2 text-xs text-gray-500">
                            Expected: {idx === 0 ? "Header Image" : idx === 1 ? "Logo" : "Direct Link (Might Fail)"}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <Link href="/" className="text-blue-600 underline">Back to Home</Link>
            </div>
        </div>
    );
}
