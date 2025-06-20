#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p images

# Download placeholder images
curl -o images/ai-foundations.jpg "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=270&fit=crop&q=80"
curl -o images/erp-essentials.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=270&fit=crop&q=80"
curl -o images/cyber-security.jpg "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=480&h=270&fit=crop&q=80"
curl -o images/iot-basics.jpg "https://images.unsplash.com/photo-1558002038-1055907df827?w=480&h=270&fit=crop&q=80"
curl -o images/ev-technology.jpg "https://images.unsplash.com/photo-1617704548623-340376564e68?w=480&h=270&fit=crop&q=80"
curl -o images/drone-technology.jpg "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=480&h=270&fit=crop&q=80"

echo "Images downloaded successfully!" 