import React from 'react';
import { Box, Typography, Paper, Link, Chip, Stack, alpha } from '@mui/material';
import { Message } from './types';
import AttachmentIcon from '@mui/icons-material/Attachment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PictureAsPdfIcon fontSize="small" />;
    if (fileType.includes('image')) return <ImageIcon fontSize="small" />;
    if (fileType.includes('text')) return <DescriptionIcon fontSize="small" />;
    if (fileType.includes('javascript') || fileType.includes('json') || 
        fileType.includes('html') || fileType.includes('css')) return <CodeIcon fontSize="small" />;
    return <InsertDriveFileIcon fontSize="small" />;
  };

  // Format file size to be human-readable
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Generate URL for file preview or download
  const getFileUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAi ? 'flex-start' : 'flex-end',
        mb: 2,
        animation: 'fadeIn 0.3s ease',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '80%',
          backgroundColor: isAi ? 'white' : 'primary.main',
          backgroundImage: isAi ? 'none' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: isAi ? 'text.primary' : 'white',
          borderRadius: isAi ? '16px 16px 16px 0' : '16px 16px 0 16px',
          boxShadow: isAi 
            ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
            : '0 4px 12px rgba(99, 102, 241, 0.3)',
        }}
      >
        {message.content && (
          <Typography variant="body1" sx={{ lineHeight: 1.5 }}>{message.content}</Typography>
        )}
        
        {/* Display file attachments if present */}
        {message.files && message.files.length > 0 && (
          <Stack spacing={1} sx={{ mt: message.content ? 2 : 0 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {message.files.length} {message.files.length === 1 ? 'Attachment' : 'Attachments'}:
            </Typography>
            
            {message.files.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const fileUrl = getFileUrl(file);
              
              return (
                <Box key={index} sx={{ mb: 1 }}>
                  {isImage ? (
                    // Show image preview for image files
                    <Box sx={{ position: 'relative', maxWidth: '100%' }}>
                      <Box
                        component="img"
                        src={fileUrl}
                        alt={file.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          objectFit: 'contain',
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                        onClick={() => window.open(fileUrl, '_blank')}
                      />
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        {file.name} ({formatFileSize(file.size)})
                      </Typography>
                    </Box>
                  ) : (
                    // Show file chip for non-image files
                    <Chip
                      icon={getFileIcon(file.type)}
                      label={`${file.name} (${formatFileSize(file.size)})`}
                      component={Link}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener"
                      clickable
                      sx={{
                        maxWidth: '100%',
                        p: 0.5,
                        borderRadius: 1.5,
                        backgroundColor: isAi ? alpha('#6366F1', 0.1) : 'rgba(255, 255, 255, 0.2)',
                        color: isAi ? 'text.primary' : 'white',
                        '& .MuiChip-icon': {
                          color: isAi ? '#6366F1' : 'white',
                        },
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isAi ? alpha('#6366F1', 0.2) : 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
        
        <Typography
          variant="caption"
          sx={{ 
            display: 'block', 
            mt: 1, 
            textAlign: isAi ? 'left' : 'right', 
            opacity: 0.7,
            fontSize: '0.7rem' 
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;