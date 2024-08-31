import React, { useState, useEffect } from "react";
import { Layer, Dialog, Trigger, createfkwID } from "../index";


const Home: React.FC = () => {
  const [id_1] = useState<string>('popup-1');
  const [id_2] = useState<string>('popup-2');
  const [p1State, setP1State] = useState(true);

  useEffect(() => console.log(`OUT - ${p1State}`), [p1State]);

  return (
    <div className="Home bg-slate-400 w-full h-full min-h-screen">
      <Layer className="fkw-popup--fancy" settings={{}}>
        <Dialog id={id_1} stateSetter={setP1State}>
          <p>DIALOG 1</p>

          <Trigger id={id_1}>
            <p>TRIGGER 1</p>
          </Trigger>
        </Dialog>

        <Dialog id={id_2}>
          <p>DIALOG 2</p>

          <Trigger id={id_2}>
            <p>TRIGGER 2</p>
          </Trigger>
        </Dialog>
      </Layer>

      <Trigger id={id_1}>
        <p>TRIGGER 1</p>
      </Trigger>

      <Trigger id={id_2}>
        <p>TRIGGER 2</p>
      </Trigger>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default Home;