import React from "react";
import { Updater } from "use-immer";
import s from "./FileUploads.module.css";
import setupSctPng from "./images/setupSct.png";
import amitseSctPng from "./images/amitseSct.png";
import setupdataBinPng from "./images/setupdataBin.png";
import { Tooltip, FileInput, Image, Stack, Group, Button } from "@mantine/core";
import { IconDownload, IconUpload } from "@tabler/icons";
import { Data, parseData } from "../scripts";

async function binToHexString(file: File) {
  return [...new Uint8Array(await file.arrayBuffer())]
    .map((x) => x.toString(16).toUpperCase().padStart(2, "0"))
    .join("");
}

export interface Files {
  setupSctContainer: FileContainer;
  setupTxtContainer: FileContainer;
  amitseSctContainer: FileContainer;
  setupdataBin: FileContainer;
}

export interface FileContainer {
  file?: File;
  textContent?: string;
  isWrongFile: boolean;
}

export interface FileUploadsProps {
  files: Files;
  setFiles: Updater<Files>;
  setData: Updater<Data>;
}

export function FileUploads({ files, setFiles, setData }: FileUploadsProps) {
  React.useEffect(() => {
    if (
      Object.values(files).every(
        (fileContainer) => fileContainer.file && !fileContainer.isWrongFile
      )
    ) {
      if (
        Object.values(files).every(
          (fileContainer) => !fileContainer.textContent
        )
      ) {
        Promise.all([
          (files.setupTxtContainer.file as File).text(),
          binToHexString(files.setupSctContainer.file as File),
          binToHexString(files.amitseSctContainer.file as File),
          binToHexString(files.setupdataBin.file as File),
        ]).then((values) =>
          setFiles((draft) => {
            draft.setupTxtContainer.textContent = values[0];
            draft.setupSctContainer.textContent = values[1];
            draft.amitseSctContainer.textContent = values[2];
            draft.setupdataBin.textContent = values[3];
          })
        );
      } else {
        parseData(files).then((data) => setData(data));
      }
    }
  }, [files, setFiles, setData]);

  return (
    <Stack className={s.padding}>
      <Group grow>
        <Button
          variant="default"
          size="lg"
          component="a"
          href="https://github.com/LongSoft/UEFITool/releases"
          target="_blank"
          leftIcon={<IconDownload />}
        >
          {`UEFITool`}
        </Button>

        <Button
          variant="default"
          size="lg"
          component="a"
          href="https://github.com/LongSoft/IFRExtractor-RS/suites/9555751857/artifacts/454700873"
          target="_blank"
          leftIcon={<IconDownload />}
        >
          {`IFRExtractor-RS`}
        </Button>
      </Group>

      <Tooltip label={<Image src={setupSctPng} />}>
        <FileInput
          icon={<IconUpload />}
          size="lg"
          placeholder="Setup SCT"
          accept=".sct"
          value={files.setupSctContainer.file}
          error={files.setupSctContainer.isWrongFile}
          onChange={(file) => {
            if (file) {
              setFiles((draft) => {
                draft.setupSctContainer = {
                  file,
                  isWrongFile: !file.name.toLowerCase().includes("setup"),
                };
              });
            }
          }}
        />
      </Tooltip>

      <Tooltip
        label={`ifrextractor.exe "Section_PE32_image_Setup.sct" verbose`}
      >
        <FileInput
          icon={<IconUpload />}
          size="lg"
          placeholder="IFR Extractor output TXT"
          accept=".txt"
          value={files.setupTxtContainer.file}
          error={files.setupTxtContainer.isWrongFile}
          onChange={(file) => {
            if (file) {
              setFiles((draft) => {
                draft.setupTxtContainer = {
                  file,
                  isWrongFile: !file.name.includes("ifr"),
                };
              });
            }
          }}
        />
      </Tooltip>

      <Tooltip label={<Image src={amitseSctPng} />}>
        <FileInput
          icon={<IconUpload />}
          size="lg"
          placeholder="AMITSE SCT"
          accept=".sct"
          value={files.amitseSctContainer.file}
          error={files.amitseSctContainer.isWrongFile}
          onChange={(file) => {
            if (file) {
              setFiles((draft) => {
                draft.amitseSctContainer = {
                  file,
                  isWrongFile: !file.name.toLowerCase().includes("amitse"),
                };
              });
            }
          }}
        />
      </Tooltip>

      <Tooltip label={<Image src={setupdataBinPng} />}>
        <FileInput
          icon={<IconUpload />}
          size="lg"
          placeholder="Setupdata BIN"
          accept=".bin"
          value={files.setupdataBin.file}
          error={files.setupdataBin.isWrongFile}
          onChange={(file) => {
            if (file) {
              setFiles((draft) => {
                draft.setupdataBin = {
                  file,
                  isWrongFile: !file.name.toLowerCase().includes("setupdata"),
                };
              });
            }
          }}
        />
      </Tooltip>
    </Stack>
  );
}
