console.info('chrome-ext template-react-ts content script')
import '../assets/jquery.min.js'
import '../popup/Popup.css'
import MessageClient from "../lib/messaging";

const mc = new MessageClient("content")

function setTimeBlockSelection(state: Boolean) {
    $(".blok-nezvetsovat").each((i, element) => {
        if (state)
            $(element).parent().css("border", "5px green solid");
        else
            $(element).parent().css("border", "");
    });
}


mc.onMessage("promptSelection", (data: any) => {
    console.log("promptSelection")
    setTimeBlockSelection(data.state)
})


function handleInnerTextChange(mutationsList: any[], observer: any) {
    mutationsList.forEach((mutation: any) => {
        if (mutation.addedNodes[0].data !== mutation.removedNodes[0].data){
            console.log("sending updated time to background");
            mc.sendMessage("popup", "updatedTime", {
                time: mutation.target.innerText
            });
        }

    });
  }

let observer = new MutationObserver(handleInnerTextChange)

function addObserverIfDesiredNodeAvailable() {
    let targetSpanElement = document.getElementsByClassName("-js-server-time")[0];
    while(!targetSpanElement) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        targetSpanElement = document.getElementsByClassName("-js-server-time")[0]
    }
    observer.observe(targetSpanElement, {
        characterData: true,
        childList: true,
        subtree: true
    })

}
addObserverIfDesiredNodeAvailable();

export {}
