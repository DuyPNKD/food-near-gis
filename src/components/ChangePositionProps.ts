import {PositionType} from "../libs/enums";
import {ChangePositionProps} from "../libs/types";

export const changePositionProps: ChangePositionProps[] = [
    {
        positionType: PositionType.default,
        imgPath: "./vietnam.svg",
        imgAlt: "Vietnam Icon",
        title: "Go to Vietnam",
    },
    {
        positionType: PositionType.userCurrent,
        imgPath: "./current.svg",
        imgAlt: "Current Location Icon",
        title: "Go to current",
    },
];
