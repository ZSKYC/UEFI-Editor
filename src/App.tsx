import React from "react";
import { useImmer } from "use-immer";
import { AppShell } from "@mantine/core";
import { Data } from "./components/scripts";
import { Files, FileUploads } from "./components/FileUploads";
import { FormUi } from "./components/FormUi";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";

export default function App() {
  const [files, setFiles] = useImmer<Files>({
    setupSctContainer: { isWrongFile: false },
    setupTxtContainer: { isWrongFile: false },
    amitseSctContainer: { isWrongFile: false },
    setupdataBin: { isWrongFile: false },
  });

  const [data, setData] = useImmer<Data>(null as unknown as Data);

  const [currentFormIndex, setCurrentFormIndex] = React.useState(-1);

  return (
    <>
      {data ? (
        <AppShell
          navbar={
            <Navigation
              data={data}
              currentFormIndex={currentFormIndex}
              setCurrentFormIndex={setCurrentFormIndex}
            />
          }
          header={
            <Header
              files={files}
              data={data}
              setData={setData}
              currentFormIndex={currentFormIndex}
              setCurrentFormIndex={setCurrentFormIndex}
            />
          }
        >
          <FormUi
            data={data}
            setData={setData}
            currentFormIndex={currentFormIndex}
            setCurrentFormIndex={setCurrentFormIndex}
          />
        </AppShell>
      ) : (
        <FileUploads files={files} setFiles={setFiles} setData={setData} />
      )}
    </>
  );
}
