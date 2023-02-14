import "./Validations.css"

function Validations(props) {
    console.log(props);
    return (
        <ul>
            {props.strings.map( (s) => (
                <li>{s}</li>
            ))}
        </ul>
    );
}

export default Validations;