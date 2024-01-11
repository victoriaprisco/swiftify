import { useEffect, useState } from "react";
import "../styles/Modes.css";

const Modes = () => {
    const changeMode = (event, value) => {
        var clicked = "";
        if(event === undefined) {
            clicked = value
        }
        if(value === undefined) {
            clicked = event.target.value
        }
        const SN_colors = {
            primary: "#f3e2ed",
            secondary: "#9B5298",
            highlight: "#4D435D",
            button: "#332936",
            buttonsecondary: "#9b5398"
        }
        const eighty_nine_colors = {
            primary: "#8DCBF1",
            secondary: "#FFE08C",
            highlight: "#0471A6",
            button: "#3685B5",
            buttonsecondary: "#2d3c57",
        }
        const rep_colors = {
            primary: "#121113",
            secondary: "#F4F4F9",
            highlight: "#5F6571",
            button: "#6BA368",
            buttonsecondary: "#929295",
        }
        const fearless_colors = {
            primary: "#F6E9BE",
            secondary: "#DCB969",
            highlight: "#CCA560",
            button: "#6F5025",
            buttonsecondary: "#5E3E23",
        }
        const debut_colors = {
            primary: "#028090",
            secondary: "#0FD0A9",
            highlight: "#FBE9BE",
            button: "#0A2239",
            buttonsecondary: "#05668D",
        }
        const red_colors = {
            primary: "#6F100F",
            secondary: "#A07A5F",
            highlight: "#DFE2CF",
            button: "#ddb094",
            buttonsecondary: "#2A0505",
        }
        const colors = {
            "sn": SN_colors,
            "1989": eighty_nine_colors,
            "rep": rep_colors,
            "fearless": fearless_colors,
            "debut": debut_colors,
            "red": red_colors
        }
        const target_color = colors[clicked];
        console.log(target_color)
        document.documentElement.style.setProperty('--primary',target_color.primary);
        document.documentElement.style.setProperty('--secondary',target_color.secondary);
        document.documentElement.style.setProperty('--highlight',target_color.highlight);
        document.documentElement.style.setProperty('--button',target_color.button);
        document.documentElement.style.setProperty('--buttonsecondary',target_color.buttonsecondary);
        localStorage.setItem("mode", clicked)
    }
    var thing = localStorage.getItem('mode')
    if(localStorage.getItem("mode") === undefined || localStorage.getItem("mode") === null){
        localStorage.setItem("mode", "1989")
        thing = "1989"
    }
    useEffect(()=>{
        changeMode(undefined, localStorage.getItem("mode"))
    })
    return (<>
        <form onChange={(e)=>changeMode(e, undefined)}>
            <h4>page styles</h4>
            <label>
                Speak Now
                <input type="radio" name="mode" value="sn" defaultChecked={thing === "sn"}/>
            </label>
            <label>
                1989
                <input type="radio" name="mode" value="1989" defaultChecked={thing === "1989"}/>
            </label>
            <label>
                Reputation
                <input type="radio" name="mode" value="rep" defaultChecked={thing === "rep"} />
            </label>
            <label>
                Fearless
                <input type="radio" name="mode" value="fearless" defaultChecked={thing === "fearless"} />
            </label>
            <label>
                Debut
                <input type="radio" name="mode" value="debut" defaultChecked={thing === "debut"} />
            </label>
            <label>
                Red
                <input type="radio" name="mode" value="red" defaultChecked={thing === "red"} />
            </label>
        </form>
    </>)
}
export default Modes;