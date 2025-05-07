import React, { useState, useEffect, useId } from "react";
import { PopupButton, PopupDialog, PopupLayer } from "./_package/index";



const Home: React.FC = () => {
  const [state, setState] = useState(false);

  const popupId1 = useId().replaceAll(':', '');
  const popupId2 = useId().replaceAll(':', '');


  useEffect(() => {
    console.log(`out state `, state);
  }, [state]);



  return (
    <div className="Home bg-slate-400 w-full h-full min-h-screen" id="screen">
      <div className="w-full h-[50px] bg-red-400 sticky top-0">
        header
      </div>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

      <PopupLayer className="flex items-center justify-center">
        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId1} state={state} animation={'fade'}>
          <PopupButton togglePopupId={popupId1}>
            <p>close 1</p>
          </PopupButton>
        </PopupDialog>

        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId2} animation={'scale'}>
          <PopupButton togglePopupId={popupId2}>
            <p>close 2</p>
          </PopupButton>
        </PopupDialog>
      </PopupLayer>

      <PopupButton togglePopupId={popupId1}>
        <p>open popup 1</p>
      </PopupButton>

      <PopupButton togglePopupId={popupId2} as="div">
        <p>open popup 2</p>
      </PopupButton>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default Home;