import "./Board.css";
import Card from "./Card";
import { AiOutlinePlus} from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoCheckmarkDoneCircleSharp} from "react-icons/io5";
function Board({ tickets, title }) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);

    return (
        <div className="brd-cnt">
            <div className="brd-hdr">
                <div>
                    <div className="flex-gap">
                        <IoCheckmarkDoneCircleSharp className="bg-icon" color={randomColor} />
                        <p>{title}</p>
                        <span>{tickets.length}</span>
                    </div>
                </div>

                <div className="flex-gap">
                    <AiOutlinePlus className="bg-c-icon" />
                    <BiDotsHorizontalRounded className="bg-c-icon" />
                </div>
            </div>
            <div className="brd-main">
                {tickets.map((ticket) => {
                    return (
                        <Card
                            key={ticket.id}
                            id={ticket.id}
                            profile="https://shubhamskg.netlify.app/assets/img/pic2.jpeg"
                            status={ticket.status}
                            title={ticket.title}
                            tag={ticket.tag[0]}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Board;
