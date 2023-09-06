console.info('chrome-ext template-react-ts content script')
import $ from 'jquery';
import MessageClient from "../lib/messaging/MessageClient";
import { Timeblock } from './../lib/timeblock';


const mc = new MessageClient("content")
let isSelectingBlock = false;


function setTimeBlockSelection(state: Boolean) {
    isSelectingBlock = true;
    $(".blok-nezvetsovat").each((i, element) => {
        if (state)
            $(element).parent().css("border", "5px green solid");
        else
            $(element).parent().css("border", "");
    });
}


function parseTimeBlockData(element: HTMLElement): Timeblock{
    const $element = $(element); // Current element
    // Extract the data-content attribute value
    const dataContent = $element.attr('data-content') || "";
    // Create a temporary element to parse the data-content HTML
    const $tempElement = $('<div>').html(dataContent);
    // Extract subject, day, and time from the parsed HTML
    const data: Timeblock = {
        subject: $tempElement.find('h5').text(),
        day: $tempElement.find('.tooltip-den').text(),
        time: $tempElement.find('.tooltip-doba').text()
    }
    return data;
}

function findSelectedTimeblock(data: Timeblock){
    const $elements = $('.blok-nezvetsovat');

    $elements.each(function () {
        parseTimeBlockData(this);
    });
}


function sendSelectedBlockData(data: Timeblock){
    mc.sendMessage("background", "selectedTimeblock", data);
}


$(()=>{
    $(".blok-nezvetsovat").on("click", (e)=>{
        if(isSelectingBlock){
            console.log(parseTimeBlockData(e.currentTarget))
        }
    })
})


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
