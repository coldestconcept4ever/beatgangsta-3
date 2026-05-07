import JSZip from 'jszip';
import { SavedRecipe, MixCritique } from '../types';

export const exportDawProjectFromCritique = async (critique: MixCritique): Promise<Blob> => {
  const zip = new JSZip();

  // Create project.xml content
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<Project xmlns="http://bitwig.com/dawproject/1.0" version="1.0">\n`;
  xml += `  <Application name="BeatGangsta" version="1.0" />\n`;
  xml += `  <MetaData title="${escapeXml(critique.title)}" />\n`;
  xml += `  <Structure>\n`;

  // Group plugins by track
  const tracks: Record<string, import('../types').DeepDivePlugin[]> = {
    Master: []
  };

  if (critique.actionPlan) {
    critique.actionPlan.forEach(action => {
      let trackName = action.targetStem || 'Master';
      if (trackName.toLowerCase() === 'master bus' || trackName.toLowerCase() === 'mix buss') trackName = 'Master';
      
      // Strip "Track X: " from start
      trackName = trackName.replace(/^Track\s+\d+:\s+/i, '');
      // Strip common audio extensions so track matches DAW track naming behavior
      trackName = trackName.replace(/\.(wav|mp3|aiff|aif|m4a|flac|ogg)$/i, '');
      
      if (!tracks[trackName]) {
        tracks[trackName] = [];
      }
      if (action.recommendedChain) {
        tracks[trackName].push(...action.recommendedChain);
      }
    });
  }

  if (critique.specificHelp) {
    critique.specificHelp.forEach((help, idx) => {
      if (help.recommendedChain && help.recommendedChain.length > 0) {
        const trackName = `Specific Query: Q${idx + 1}`;
        if (!tracks[trackName]) {
          tracks[trackName] = [];
        }
        tracks[trackName].push(...help.recommendedChain);
      }
    });
  }

  // Now create the tracks
  Object.keys(tracks).forEach(trackName => {
    const plugins = tracks[trackName];
    // Check for multiband
    const bands = [...new Set(plugins.map(p => p.band).filter(Boolean) as string[])];
    
    if (bands.length > 0) {
      // Find unbanded plugins, filtering out Gaffel
      const unbandedPlugins = plugins.filter(p => !p.band && !p.name.toLowerCase().includes('gaffel'));
      
      bands.forEach(band => {
        xml += `    <Track name="${escapeXml(trackName)} - ${escapeXml(band)}">\n`;
        xml += `      <Channel>\n`;
        xml += `        <DeviceChain>\n`;
        
        unbandedPlugins.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        
        xml += `          <Plugin name="Gaffel [${escapeXml(band)} Band]" />\n`;
        
        const bandPlugins = plugins.filter(p => p.band === band);
        bandPlugins.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        
        xml += `        </DeviceChain>\n`;
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      });
    } else if (plugins.length > 0 || trackName === 'Master') {
      xml += `    <Track name="${escapeXml(trackName)}">\n`;
      xml += `      <Channel>\n`;
      if (plugins.length > 0) {
        xml += `        <DeviceChain>\n`;
        plugins.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        xml += `        </DeviceChain>\n`;
      }
      xml += `      </Channel>\n`;
      xml += `    </Track>\n`;
    }
  });

  xml += `  </Structure>\n`;
  xml += `</Project>\n`;

  zip.file('project.xml', xml);
  
  let notes = `Critique: ${critique.title}\n`;
  notes += `Feedback: ${critique.overallFeedback}\n\n`;

  if (critique.reCritiqueContext) {
    notes += `--- RE-CRITIQUE CONTEXT ---\n${critique.reCritiqueContext}\n\n`;
  }

  if (critique.strengths && critique.strengths.length > 0) {
    notes += `--- STRENGTHS ---\n`;
    critique.strengths.forEach(s => notes += `- ${s}\n`);
    notes += `\n`;
  }

  if (critique.weaknesses && critique.weaknesses.length > 0) {
    notes += `--- AREAS FOR IMPROVEMENT ---\n`;
    critique.weaknesses.forEach(w => notes += `- ${w}\n`);
    notes += `\n`;
  }

  if (critique.actionPlan && critique.actionPlan.length > 0) {
    notes += `--- ACTION PLAN ---\n`;
    critique.actionPlan.forEach((a, i) => {
      notes += `${i + 1}. [${a.targetStem || 'Master'}] ${a.issue}\n`;
      notes += `   Solution: ${a.solution}\n`;
    });
    notes += `\n`;
  }

  if (critique.specificHelp && critique.specificHelp.length > 0) {
    notes += `--- SPECIFIC ENGINEERING QUERIES ---\n`;
    critique.specificHelp.forEach((h, i) => {
      notes += `Q${i + 1}: ${h.query}\n`;
      notes += `A: ${h.advice}\n\n`;
    });
  }

  zip.file('critique_notes.txt', notes);

  return zip.generateAsync({ type: 'blob' });
};

export const exportDawProject = async (recipe: SavedRecipe): Promise<Blob> => {
  const zip = new JSZip();

  // Create project.xml content
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<Project xmlns="http://bitwig.com/dawproject/1.0" version="1.0">\n`;
  xml += `  <Application name="BeatGangsta" version="1.0" />\n`;
  xml += `  <MetaData title="${escapeXml(recipe.title)}" />\n`;
  xml += `  <Structure>\n`;
  
  // Master Track
  xml += `    <Track name="Master">\n`;
  xml += `      <Channel>\n`;
  if (recipe.masterPlugins && recipe.masterPlugins.length > 0) {
    xml += `        <DeviceChain>\n`;
    recipe.masterPlugins.forEach(plugin => {
      xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
    });
    xml += `        </DeviceChain>\n`;
  }
  xml += `      </Channel>\n`;
  xml += `    </Track>\n`;

  // Busses (Groups/Aux)
  if (recipe.busses) {
    recipe.busses.forEach(bus => {
      const bands = [...new Set(bus.fxPlugins?.map(p => p.band).filter(Boolean) as string[])];
      
      if (bands.length > 0) {
        const unbandedPlugins = bus.fxPlugins?.filter(p => !p.band && !p.name.toLowerCase().includes('gaffel')) || [];
        
        bands.forEach(band => {
          xml += `    <Track name="${escapeXml(bus.name)} - ${escapeXml(band)}">\n`;
          xml += `      <Channel>\n`;
          xml += `        <DeviceChain>\n`;
          
          unbandedPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          
          xml += `          <Plugin name="Gaffel [${escapeXml(band)} Band]" />\n`;
          
          const bandPlugins = bus.fxPlugins?.filter(p => p.band === band) || [];
          bandPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          
          xml += `        </DeviceChain>\n`;
          xml += `      </Channel>\n`;
          xml += `    </Track>\n`;
        });
      } else {
        xml += `    <Track name="${escapeXml(bus.name)}">\n`;
        xml += `      <Channel>\n`;
        if (bus.fxPlugins && bus.fxPlugins.length > 0) {
          xml += `        <DeviceChain>\n`;
          bus.fxPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          xml += `        </DeviceChain>\n`;
        }
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      }
    });
  }

  // Instrument Tracks
  if (recipe.instruments) {
    recipe.instruments.forEach(track => {
      const bands = [...new Set(track.fxPlugins?.map(p => p.band).filter(Boolean) as string[])];
      
      if (bands.length > 0) {
        // Find unbanded plugins, filtering out the Gaffel instruction plugin if the AI added it
        const unbandedPlugins = track.fxPlugins?.filter(p => !p.band && !p.name.toLowerCase().includes('gaffel')) || [];
        
        bands.forEach(band => {
          xml += `    <Track name="${escapeXml(track.name)} - ${escapeXml(band)}">\n`;
          xml += `      <Channel>\n`;
          xml += `        <DeviceChain>\n`;
          
          // Add unbanded plugins (pre-processing before split)
          unbandedPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          
          // Add Gaffel for the split
          xml += `          <Plugin name="Gaffel [${escapeXml(band)} Band]" />\n`;
          
          // Add band-specific plugins
          const bandPlugins = track.fxPlugins?.filter(p => p.band === band) || [];
          bandPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          
          xml += `        </DeviceChain>\n`;
          xml += `      </Channel>\n`;
          xml += `    </Track>\n`;
        });
      } else {
        xml += `    <Track name="${escapeXml(track.name)}">\n`;
        xml += `      <Channel>\n`;
        if (track.fxPlugins && track.fxPlugins.length > 0) {
          xml += `        <DeviceChain>\n`;
          track.fxPlugins.forEach(plugin => {
            xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
          });
          xml += `        </DeviceChain>\n`;
        }
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      }
    });
  }

  // Vocal Elements / GangstaVox
  const voxRecipe = recipe.gangstaVox || recipe.vocalElements;
  if (voxRecipe) {
    // Vocal Tracking Chain (add as an Aux/Bus or its own Track)
    if (voxRecipe.trackingChain) {
      xml += `    <Track name="Vocal Tracking Chain">\n`;
      xml += `      <Channel>\n`;
      xml += `        <DeviceChain>\n`;
      if (voxRecipe.trackingChain.unisonPlugin) {
        xml += `          <Plugin name="${escapeXml(voxRecipe.trackingChain.unisonPlugin.name)}" />\n`;
      }
      if (voxRecipe.trackingChain.inserts) {
        voxRecipe.trackingChain.inserts.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
      }
      xml += `        </DeviceChain>\n`;
      xml += `      </Channel>\n`;
      xml += `    </Track>\n`;

      if (voxRecipe.trackingChain.aux1 && voxRecipe.trackingChain.aux1.length > 0) {
        xml += `    <Track name="Vocal Aux 1">\n`;
        xml += `      <Channel>\n`;
        xml += `        <DeviceChain>\n`;
        voxRecipe.trackingChain.aux1.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        xml += `        </DeviceChain>\n`;
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      }
      
      if (voxRecipe.trackingChain.aux2 && voxRecipe.trackingChain.aux2.length > 0) {
        xml += `    <Track name="Vocal Aux 2">\n`;
        xml += `      <Channel>\n`;
        xml += `        <DeviceChain>\n`;
        voxRecipe.trackingChain.aux2.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        xml += `        </DeviceChain>\n`;
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      }
    }

    if (voxRecipe.vocalTracks) {
      voxRecipe.vocalTracks.forEach(track => {
        const bands = [...new Set(track.fxPlugins?.map(p => p.band).filter(Boolean) as string[])];
        
        if (bands.length > 0) {
          const unbandedPlugins = track.fxPlugins?.filter(p => !p.band && !p.name.toLowerCase().includes('gaffel')) || [];
          bands.forEach(band => {
            xml += `    <Track name="${escapeXml(track.name)} - ${escapeXml(band)}">\n`;
            xml += `      <Channel>\n`;
            xml += `        <DeviceChain>\n`;
            unbandedPlugins.forEach(plugin => {
              xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
            });
            xml += `          <Plugin name="Gaffel [${escapeXml(band)} Band]" />\n`;
            const bandPlugins = track.fxPlugins?.filter(p => p.band === band) || [];
            bandPlugins.forEach(plugin => {
              xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
            });
            xml += `        </DeviceChain>\n`;
            xml += `      </Channel>\n`;
            xml += `    </Track>\n`;
          });
        } else {
          xml += `    <Track name="${escapeXml(track.name)}">\n`;
          xml += `      <Channel>\n`;
          if (track.fxPlugins && track.fxPlugins.length > 0) {
            xml += `        <DeviceChain>\n`;
            track.fxPlugins.forEach(plugin => {
              xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
            });
            xml += `        </DeviceChain>\n`;
          }
          xml += `      </Channel>\n`;
          xml += `    </Track>\n`;
        }
      });
    }
  }

  // Add Drum Tracks if drumPatterns exist to easily start programming
  if (recipe.drumPatterns) {
    ['Kick', 'Snare', 'HiHat'].forEach(drum => {
      xml += `    <Track name="${drum}">\n`;
      xml += `      <Channel>\n`;
      xml += `      </Channel>\n`;
      xml += `    </Track>\n`;
    });
  }

  if (recipe.specificHelp) {
    recipe.specificHelp.forEach((help, idx) => {
      if (help.recommendedChain && help.recommendedChain.length > 0) {
        xml += `    <Track name="Specific Query: Q${idx + 1}">\n`;
        xml += `      <Channel>\n`;
        xml += `        <DeviceChain>\n`;
        help.recommendedChain.forEach(plugin => {
          xml += `          <Plugin name="${escapeXml(plugin.name)}" />\n`;
        });
        xml += `        </DeviceChain>\n`;
        xml += `      </Channel>\n`;
        xml += `    </Track>\n`;
      }
    });
  }

  xml += `  </Structure>\n`;
  xml += `</Project>\n`;

  zip.file('project.xml', xml);
  
  // Also add a text version of the recipe for reference
  let notes = `Recipe: ${recipe.title}\n`;
  notes += `Style: ${recipe.style}\n`;
  notes += `BPM: ${recipe.bpm}\n`;
  if (recipe.recommendedScale) notes += `Scale/Key: ${recipe.recommendedScale}\n`;
  if (recipe.chordProgression) notes += `Chord Progression: ${recipe.chordProgression}\n`;
  notes += `\nDescription: ${recipe.description}\n\n`;

  if (recipe.arrangement && Object.keys(recipe.arrangement).length > 0) {
    notes += `--- ARRANGEMENT ---\n`;
    Object.entries(recipe.arrangement).forEach(([key, value]) => {
      notes += `${key}: ${value}\n`;
    });
    notes += `\n`;
  }

  if (recipe.drumPatterns) {
    notes += `--- DRUM PATTERNS ---\n`;
    Object.entries(recipe.drumPatterns).forEach(([section, pattern]) => {
      notes += `\n[${section.toUpperCase()}]\n`;
      notes += `Kick: ${JSON.stringify(pattern.kick?.steps || [])}\n`;
      notes += `Snare: ${JSON.stringify(pattern.snare?.steps || [])}\n`;
      notes += `HiHat: ${JSON.stringify(pattern.hiHat?.steps || [])}\n`;
    });
    notes += `\n`;
  }

  if (recipe.layeringStrategy) {
    notes += `--- LAYERING STRATEGY ---\n`;
    notes += `${recipe.layeringStrategy}\n\n`;
  }

  if (recipe.mixingAdvice) {
    notes += `--- MIXING ADVICE ---\n`;
    notes += `${recipe.mixingAdvice}\n\n`;
  }

  const vox = recipe.gangstaVox || recipe.vocalElements;
  if (vox && vox.layeringStrategy) {
    notes += `--- VOCAL LAYERING STRATEGY ---\n`;
    notes += `${vox.layeringStrategy}\n\n`;
  }

  zip.file('recipe_notes.txt', notes);

  return zip.generateAsync({ type: 'blob' });
};

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
    return c;
  });
}
