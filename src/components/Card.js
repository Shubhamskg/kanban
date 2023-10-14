import { AiOutlineDash } from "react-icons/ai";
import { BsFillCircleFill } from "react-icons/bs";
import { PiUserCirclePlusFill } from "react-icons/pi";
import "./Card.css";
const Card = ({ id, profile, status, title, tag }) => {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return (
        <div className="tkt-crd-cnt brd-crv">
            <div className="tkt-crd-head">
                <p>{id}</p>
                {profile ? (
                    <div>
                        <div className="tkt-img-cnt">
                        <PiUserCirclePlusFill className="image" color={randomColor}/>
                        </div>

                        <span
                            className={`tkt-avt-bdg ${
                                status === true ? "available" : ""
                            }`}
                        ></span>
                    </div>
                ) : null}
            </div>
            <div className="tkt-crd-hero">
                <div className="tkt-crd-title">
                    <p>{title}</p>
                </div>

                <div className="tkt-tag-cnt">
                    <div className="alert-icon brd-crv">
                        <AiOutlineDash className="bg-color-icon" />
                    </div>
                    <div className="tkt-crd-tag brd-crv">
                        <BsFillCircleFill className="bg-color-icon sm" />
                        <p className="tag-text">{tag}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Card;
