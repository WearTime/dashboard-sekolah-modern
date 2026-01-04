import * as XLSX from "xlsx";
import { ImportConfig, ImportResult, ImportError } from "WT/types/import";

export class ExcelParser {
  private config: ImportConfig;

  constructor(config: ImportConfig) {
    this.config = config;
  }

  /**
   * |========================================================|
   * | Parse Excel file dan return data yang sudah divalidasi |
   * |========================================================|
   */
  async parseFile(file: File): Promise<ImportResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      if (rawData.length === 0) {
        return {
          success: false,
          totalRows: 0,
          successCount: 0,
          failedCount: 0,
          errors: [
            {
              row: 0,
              message: "File Excel kosong atau tidak ada data",
            },
          ],
        };
      }

      const headerValidation = this.validateHeaders(rawData[0]);
      if (!headerValidation.valid) {
        return {
          success: false,
          totalRows: 0,
          successCount: 0,
          failedCount: 0,
          errors: headerValidation.errors,
        };
      }

      const parseResult = this.parseAndValidateRows(rawData);

      return parseResult;
    } catch (error) {
      console.error("Error parsing Excel:", error);
      return {
        success: false,
        totalRows: 0,
        successCount: 0,
        failedCount: 0,
        errors: [
          {
            row: 0,
            message: `Error membaca file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }

  /**
   * |========================================================|
   * |          Validasi header Excel sesuai config           |
   * |========================================================|
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private validateHeaders(firstRow: any): {
    valid: boolean;
    errors: ImportError[];
  } {
    const errors: ImportError[] = [];
    const excelHeaders = Object.keys(firstRow);
    const requiredHeaders = this.config.columns
      .filter((col) => col.required)
      .map((col) => col.header);

    for (const requiredHeader of requiredHeaders) {
      if (!excelHeaders.includes(requiredHeader)) {
        errors.push({
          row: 0,
          field: requiredHeader,
          message: `Header wajib "${requiredHeader}" tidak ditemukan`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * |========================================================|
   * |          Parse dan validasi setiap row data            |
   * |========================================================|
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseAndValidateRows(rawData: any[]): ImportResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validData: any[] = [];
    const errors: ImportError[] = [];

    rawData.forEach((row, index) => {
      const rowNumber = index + 2;

      try {
        const isEmpty = Object.values(row).every(
          (val) => val === "" || val === null || val === undefined
        );
        if (isEmpty) {
          return;
        }

        const transformedData = this.transformRow(row);

        const validationResult =
          this.config.validator.safeParse(transformedData);

        if (!validationResult.success) {
          validationResult.error.issues.forEach((err) => {
            errors.push({
              row: rowNumber,
              field: err.path.join("."),
              message: err.message,
              value: transformedData[err.path[0] as string],
            });
          });
        } else {
          validData.push(validationResult.data);
        }
      } catch (error) {
        errors.push({
          row: rowNumber,
          message: `Error parsing row: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    });

    return {
      success: errors.length === 0,
      totalRows: rawData.length,
      successCount: validData.length,
      failedCount: errors.length,
      errors,
      data: validData,
    };
  }

  /**
   * |========================================================|
   * | Transform row data dari Excel header ke database field |
   * |========================================================|
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformRow(row: any): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed: any = {};

    this.config.columns.forEach((column) => {
      let value = row[column.header];

      if (column.transform && value !== undefined && value !== null) {
        try {
          value = column.transform(value);
        } catch (error) {
          console.error(`Error transforming ${column.header}:`, error);
        }
      }

      transformed[column.field] = value === "" ? undefined : value;
    });

    return transformed;
  }

  /**
   * |========================================================|
   * |         Generate template Excel untuk download         |
   * |========================================================|
   */
  generateTemplate(): Blob {
    const headers = this.config.columns.map((col) => col.header);
    const descriptions = this.config.columns.map(
      (col) => col.description || ""
    );
    const exampleRow = this.generateExampleRow();

    const data = [headers, descriptions, exampleRow];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet["!cols"] = this.config.columns.map(() => ({ wch: 20 }));

    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.config.entityName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  /**
   * |========================================================|
   * |           Generate contoh row untuk template           |
   * |========================================================|
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private generateExampleRow(): any[] {
    return this.config.columns.map((col) => {
      switch (col.field) {
        case "nisn":
          return "0123456789";
        case "nip":
          return "199001012020011001";
        case "nama":
          return "Contoh Nama";
        case "kelas":
          return "XII";
        case "jurusan":
          return "PPLG";
        case "jenis_kelamin":
          return "L";
        case "status":
          return "ASN";
        case "golongan":
          return "III/a";
        case "tempat_lahir":
          return "Jakarta";
        case "tanggal_lahir":
        case "tanggal":
          return "2005-01-15";
        case "no_hp":
          return "081234567890";
        case "alamat":
          return "Jl. Contoh No. 123";
        case "recipient_type":
          return "Siswa";
        case "level":
          return "Nasional";
        case "name":
          return "Juara 1 Lomba Programming";
        case "description":
          return "Deskripsi prestasi yang diraih";
        case "penyelenggara":
          return "Kemendikbud";
        case "nama_penerima":
          return "Nama Siswa/Guru";
        default:
          return col.required ? "..." : "";
      }
    });
  }
}

/**
 * |========================================================|
 * |     Helper function untuk format error messages        |
 * |========================================================|
 */
export function formatImportErrors(errors: ImportError[]): string {
  return errors
    .map((err) => {
      const parts = [`Baris ${err.row}`];
      if (err.field) parts.push(`(${err.field})`);
      parts.push(`: ${err.message}`);
      if (err.value !== undefined) parts.push(`- Value: "${err.value}"`);
      return parts.join(" ");
    })
    .join("\n");
}
