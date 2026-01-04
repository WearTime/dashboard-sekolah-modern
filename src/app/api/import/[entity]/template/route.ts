import { NextRequest, NextResponse } from "next/server";
import { ExcelParser } from "WT/lib/excel-parser";
import { importConfigs, ImportEntityType } from "WT/config/import.config";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await context.params;

    if (!importConfigs[entity as ImportEntityType]) {
      return NextResponse.json(
        {
          success: false,
          message: `Entity type "${entity}" tidak didukung`,
        },
        { status: 400 }
      );
    }

    const config = importConfigs[entity as ImportEntityType];
    const parser = new ExcelParser(config);

    const templateBlob = parser.generateTemplate();
    const buffer = await templateBlob.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${config.templateName}"`,
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal generate template",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
