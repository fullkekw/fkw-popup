import React, { useState, useEffect, useId } from "react";
import { PopupButton, PopupDialog, PopupLayer, } from "./_package/index";



const Home: React.FC = () => {
  const [state, setState] = useState(true);

  const popupId1 = useId();
  const popupId2 = useId();


  useEffect(() => {
    console.log(`out state `, state);
  }, [state]);



  return (
    <div className="Home bg-slate-400 w-full h-full min-h-screen" id="screen">
      <PopupLayer className="flex items-center justify-center">
        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId1} state={state}>
          <PopupButton togglePopupId={popupId1}>
            <p>close 1</p>
          </PopupButton>
        </PopupDialog>

        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId2}>
          <PopupButton togglePopupId={popupId2}>
            <p>close 2</p>
          </PopupButton>
        </PopupDialog>
      </PopupLayer>

      <PopupButton togglePopupId={popupId1}>
        <p>open popup 1</p>
      </PopupButton>

      <PopupButton togglePopupId={popupId2}>
        <p>open popup 2</p>
      </PopupButton>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default Home;