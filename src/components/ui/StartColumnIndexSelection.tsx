import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileData } from "@/components/excel-comparison";
import { PrimitiveAtom, useAtom } from "jotai/index";

export function StartColumnIndexSelection({
  fileDataAtom,
  fileDataStartIndexAtom,
}: {
  fileDataAtom: PrimitiveAtom<FileData | null>;
  fileDataStartIndexAtom: PrimitiveAtom<number | undefined>;
}) {
  const [fileData, setFileData] = useAtom(fileDataAtom);
  const [fileDataStartIndex, setFileDataStartIndex] = useAtom(
    fileDataStartIndexAtom,
  );

  return (
    <Select
      onValueChange={(value: string) => {
        const selectedIndex = parseInt(value, 10);
        const newHeaders = fileData?.rows[selectedIndex]; // Get the headers from the selected row
        if (newHeaders) {
          setFileDataStartIndex(selectedIndex);
          setFileData({
            ...fileData,
            headers: newHeaders,
          });
        }
      }}
      value={
        fileDataStartIndex !== undefined ? `${fileDataStartIndex}` : undefined
      }
    >
      <SelectTrigger className="w-full mb-4">
        <SelectValue placeholder="Select Header Index" />
      </SelectTrigger>
      <SelectContent>
        {fileData &&
          fileData.rows.length > 0 &&
          fileData.rows.map((_, index) => (
            <SelectItem key={index} value={`${index}`}>
              {index + 1}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
