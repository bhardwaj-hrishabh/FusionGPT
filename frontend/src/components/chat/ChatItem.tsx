import { Avatar, Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Function to check if the string is a code block
// function isCodeBlock(str: string) {
//     return (
//         str.includes('=') ||
//         str.includes(';') ||
//         str.includes('[') ||
//         str.includes(']') ||
//         str.includes('{') ||
//         str.includes('}') ||
//         str.includes('#') ||
//         str.includes('//') ||
//         str.includes('function')
//     );
// }

function parseMessageWithCode(content: string) {
    const blocks = content.split('```');
    return blocks.map((block, index) => {
        if (index % 2 === 1) {
            return (
                <SyntaxHighlighter
                    style={coldarkDark}
                    language="javascript"
                    key={index}
                >
                    {block}
                </SyntaxHighlighter>
            );
        }
        return (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                {block}
            </ReactMarkdown>
        );
    });
}

const ChatItem = ({
    content,
    role,
}: {
    content: string;
    role: 'user' | 'assistant';
}) => {
    const auth = useAuth();

    // Adjusted font size to be smaller and more readable
    const commonStyle = {
        fontSize: '16px', // Adjusted font size for better readability
        lineHeight: '1.5',
    };

    return role === 'assistant' ? (
        <Box
            sx={{
                display: 'flex',
                p: 2,
                bgcolor: '#004d5612',
                my: 2,
                gap: 2,
            }}
        >
            <Avatar sx={{ ml: '0' }}>
                <img src="openai.png" alt="openai" width={'30px'} />
            </Avatar>
            <Box>
                {/* Render the entire message content with syntax highlighter for code */}
                <Typography sx={{ ...commonStyle }}>
                    {parseMessageWithCode(content)}
                </Typography>
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                display: 'flex',
                p: 2,
                bgcolor: '#004d56',
                gap: 2,
                my: 2,
            }}
        >
            <Avatar sx={{ ml: '0', bgcolor: 'black', color: 'white' }}>
                {auth?.user?.name[0]}
                {auth?.user?.name.split(' ')[1][0]}
            </Avatar>
            <Box>
                {/* Render user message content with markdown */}
                <Typography sx={{ ...commonStyle }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatItem;
