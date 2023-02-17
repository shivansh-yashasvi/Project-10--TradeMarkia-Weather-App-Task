import styled from 'styled-components';

export const MainStyledComponent = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background: ${props => props.temperature < 15 ? "linear-gradient(169.07deg, #aa80ff -2.85%, #9966ff 56.89%, #bb99ff 111.88%, #79C7FF 124.61%)" : props.temperature >= 15 && props.temperature <= 30 ? "linear-gradient(169.07deg, #ffb3cc 1.13%, #ff80aa 84.78%);" : "linear-gradient(169.07deg, #ff4d88 -2.85%, #ff66a3 25.69%, #ff8080 52.25%, #ff6666 74.82%, #ff4d4d 102.7%);"};

`

// background: ${props => props.temperature < 15 ? "linear-gradient(169.07deg, #5B57D4 -2.85%, #7C78FF 56.89%, #80A9F9 111.88%, #79C7FF 124.61%)" : props.temperature >= 15 && props.temperature <= 30 ? "linear-gradient(169.07deg, #5F82FF 1.13%, #6ADBFF 84.78%);" : "linear-gradient(169.07deg, #FF3838 -2.85%, #FF5C5C 25.69%, #FF774D 52.25%, #FFB800 74.82%, #FFE600 102.7%);"};


// background-image: url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWE5ZGI0NzRmZGRhYTUzMDY0MzM3ODNjZjEzYzY5N2MxMzcxZTQ1NSZjdD1n/b5saLoxYKNFS4nILg7/giphy.gif);
// background-size: cover;