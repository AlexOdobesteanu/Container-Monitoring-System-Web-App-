import React from 'react'

const AddContainer = () => {
    return (
        <div className="card input-field" style={{
            margin: "10px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="insert IP"></input>
            <input type="text" placeholder='username for container'></input>
            <input type="text" placeholder='password for container'></input>
            <button class="btn waves-effect waves-light green">
                Submit Container
            </button>

        </div>
    )
}

export default AddContainer