import { query } from '@/lib/db';

// GET - Load page layout
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageName = searchParams.get('page') || 'home';

        const result = await query(
            'SELECT layout_json FROM page_layouts WHERE page_name = ?',
            [pageName]
        );

        if (result.length > 0) {
            return Response.json({
                success: true,
                data: JSON.parse(result[0].layout_json)
            });
        }

        // Return default layout if none saved
        return Response.json({
            success: true,
            data: null
        });
    } catch (error) {
        console.error('Error loading layout:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Save page layout
export async function POST(request) {
    try {
        const { page_name, layout } = await request.json();

        if (!page_name || !layout) {
            return Response.json(
                { success: false, error: 'Missing page_name or layout' },
                { status: 400 }
            );
        }

        const layoutJson = JSON.stringify(layout);

        // Upsert the layout
        await query(
            `INSERT INTO page_layouts (page_name, layout_json) 
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE layout_json = VALUES(layout_json), updated_at = CURRENT_TIMESTAMP`,
            [page_name, layoutJson]
        );

        return Response.json({ success: true, message: 'Layout saved successfully' });
    } catch (error) {
        console.error('Error saving layout:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
