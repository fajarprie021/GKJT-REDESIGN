import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple MIME type map to avoid external dependencies
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        case '.webp': return 'image/webp';
        case '.pdf': return 'application/pdf';
        default: return 'application/octet-stream';
    }
}

export async function GET(request, { params }) {
    const { path: pathSegments } = await params;

    // Base directory where images are stored (old CodeIgniter project)
    const baseDir = 'C:\\xampp\\htdocs\\ci_gkj2';

    // Construct the full file path
    // e.g. /api/images/assets/images/foto.jpg -> pathSegments = ['assets', 'images', 'foto.jpg']
    const filePath = path.join(baseDir, ...pathSegments);

    // Security check: prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedPath.startsWith(resolvedBase)) {
        return new NextResponse('Access Denied', { status: 403 });
    }

    try {
        if (!fs.existsSync(resolvedPath)) {
            return new NextResponse(`File not found: ${resolvedPath}`, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(resolvedPath);
        const contentType = getMimeType(resolvedPath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}
