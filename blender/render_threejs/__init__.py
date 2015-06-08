#!/bin/python

bl_info = {
    "name": "ThreeJS",
    "author": "Devin Chen <d3vin.chen@gmail.com>",
    "version": (0, 0, 1),
    "blender": (2, 74, 0),
    "location": "Render > Engine > ThreeJS",
    "description": "WebGL render in Chrome",
    "warning": "",
    #"wiki_url": "http://wiki.blender.org/index.php/Extensions:2.5/Py/"
    #            "Scripts/Render/ThreeJS",
    "category": "Render",
}

import bpy

class ThreeJS(bpy.types.RenderEngine):
    bl_idname = 'THREEJS_RENDER'
    bl_label = "ThreeJS"

    def render(self, scene):
        print('Do test renders with Blender Render')
        
        scale = scene.render.resolution_percentage / 100.0
        self.size_x = int(scene.render.resolution_x * scale)
        self.size_y = int(scene.render.resolution_y * scale)
        
        print( "x=%s" % self.size_x )
        print( "y=%s" % self.size_y )        
        
        pixel_count = self.size_x * self.size_y

        # The framebuffer is defined as a list of pixels, each pixel
        # itself being a list of R,G,B,A values
        green_rect = [[0.0, 1.0, 0.0, 1.0]] * pixel_count

        # Here we write the pixel values to the RenderResult
        result = self.begin_result(0, 0, self.size_x, self.size_y)
        layer = result.layers[0]
        
        # Load a static file created by Chrome.
        #layer.rect = green_rect
        layer.load_from_file( "c:\\webgl.jpg", 0, 0 )
        
        self.end_result(result)

def register():
    bpy.utils.register_module(__name__)

def unregister():
    bpy.utils.unregister_module(__name__)

if __name__ == "__main__":
    register()