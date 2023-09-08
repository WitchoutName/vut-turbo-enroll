console.info('chrome-ext template-react-ts content script')
import $ from 'jquery';
import './style.css'
import MessageClient from "../lib/messaging/MessageClient";
import { Timeblock } from './../lib/timeblock';
import Endpoints from './endpoints';
import Ep from '../popup/endpoints';
import Eb from '../background/endpoints'


const mc = new MessageClient("content")
let isSelectingBlock = false;
let selectedBlock = {};

document.addEventListener('click', function (event) {
      // Prevent the popup from closing
      event.stopPropagation();
  });


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
        subject: $tempElement.find("tr:first-child > td").text(),
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
    mc.sendMessage("background", Eb.SelectedTimeblock, data);
}


$(()=>{
    console.log(new Date())
    $(".blok-nezvetsovat").on("click", (e)=>{
        if(isSelectingBlock){
            setTimeBlockSelection(false)
            $(".selected-icon").remove();
            const icon = $("<div>").addClass("selected-icon").text("✓");
            $(e.currentTarget).append(icon);
            const data = parseTimeBlockData(e.currentTarget)
            sendSelectedBlockData(data);
            selectedBlock = data;
        }
    })
})


mc.onMessage(Endpoints.PromptSelection, (data: any) => {
    setTimeBlockSelection(data.state);
})


export {}
