import React, { Component } from 'react';
import * as NGL from 'ngl';

const RESIDUES = {
  'GLY': 'G',
  'ALA': 'A',
  'VAL': 'V',
  'LEU': 'L',
  'ILE': 'I',
  'MET': 'M',
  'PRO': 'P',
  'PHE': 'F',
  'THR': 'T',
  'CYS': 'C',
  'HIS': 'H',
  'SER': 'S',
  'TYR': 'Y',
  'TRP': 'W',
  'GLN': 'Q',
  'ASN': 'N',
  'GLU': 'E',
  'ASP': 'D',
  'LYS': 'K',
  'ARG': 'R',
};

class NGLScene extends Component {
  constructor(props) {
    super(props);

    this.draw = this.draw.bind(this);
    this.redrawMethylase = this.redrawMethylase.bind(this);
		this.setProteinRepresentation = this.setProteinRepresentation.bind(this);
		this.setLigandRepresentation = this.setLigandRepresentation.bind(this);
		this.toggleContacts = this.toggleContacts.bind(this)
		this.toggleLigandMode = this.toggleLigandMode.bind(this)
  }

  componentDidMount() {
    this.stage = new NGL.Stage(this.nglScene);
		this.stage.setParameters({ backgroundColor: this.props.backgroundColor }) //, tooltip: false });
    this.draw(this.props);

    this.stage.signals.hovered.add((pickingProxy) => {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)){
        var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
				//this.props.setTooltip({ atom: atom.atomname, residue: atom.resname, position: atom.resno });
      }else{
				//this.props.setTooltip(null);
      }
    });
  }

  shouldComponentUpdate() {
      return false;
  }

  draw(props) {
    this.stage.loadFile("/data/2isk.pdb").then((component) => {
      this.component = component;
			this.setProteinRepresentation(props.representation, this.props.ligandPocketOnly)
			this.ligandPocket = this.component.structure.getAtomSetWithinSelection(new NGL.Selection("ligand"), 10)
			this.component.autoView();
			this.setLigandRepresentation(this.props.ligandRepresentation)
			this.toggleContacts(this.props.showContacts)

    })
	}

	setProteinRepresentation(representation, ligandMode) {
	  let opacity, sele;
	  if(ligandMode) {
		  opacity = 0.5
			sele = this.ligandPocket.toSeleString()
		} else {
		  opacity = 1
			sele = ''
		}
		this.component.removeRepresentation(this.representation)
		this.component.removeRepresentation(this.sidechains)
		if(representation === "dual") {
			this.representation = this.component.addRepresentation("cartoon", { opacity, sele });
			this.sidechains = this.component.addRepresentation("licorice", { opacity, sele });
		} else {
			this.representation = this.component.addRepresentation(representation, { opacity, sele });
		}
	}

	setLigandRepresentation(representation) {
		this.component.removeRepresentation(this.ligandRepresentation)
		this.ligandRepresentation = this.component.addRepresentation(representation, { sele: 'ligand' })
	}

  redrawMethylase(nextProps) {
    this.stage.removeAllComponents();
    this.draw(nextProps);
	}

	toggleContacts(show) {
	  if(show) {
	this.contacts = this.component.addRepresentation("contact", {backboneHydrogenBond: false, sidechainHydrogenBond: false, filterSele: "ligand"});
		} else {
			this.component.removeRepresentation(this.contacts);
		}
	}

  getSchemeId(selection) {
    if (!selection.start || !selection.end) return null;

    
    var schemeId = NGL.ColormakerRegistry.addScheme( function( params ){
      this.atomColor = function( atom ){
          if( atom.resno >= +selection.start && atom.resno <= +selection.end ){
              return 0x00FF00;  // blue
          } else {
              return 0x0000FF;  // green
          }
      };
    } );
    return { color: schemeId };
  }

	toggleLigandMode(on) {
		 this.setProteinRepresentation(this.props.representation, on)
		 this.setLigandRepresentation(this.props.ligandRepresentation)
	}


  componentWillReceiveProps(newProps) {
    if (this.props.pdbId !== newProps.pdbId){
      this.redrawMethylase(newProps);
    } else if (this.props.representation !== newProps.representation) {
			 this.setProteinRepresentation(newProps.representation, this.props.ligandPocketOnly);
    } else if (this.props.selection !== newProps.selection) {
      if(newProps.selection.start > newProps.selection.end) return;
      this.component.removeAllRepresentations();
      this.component.addRepresentation(newProps.representation);
		} else if (this.props.ligandRepresentation !== newProps.ligandRepresentation) {
		  this.setLigandRepresentation(newProps.ligandRepresentation)
		} else if (this.props.showContacts !== newProps.showContacts) {
			this.toggleContacts(newProps.showContacts)
	 } else if (this.props.ligandPocketOnly !== newProps.ligandPocketOnly) {
	   this.toggleLigandMode(newProps.ligandPocketOnly)
	 }
  }

  render() {
    return (
      <div className="ngl-scene-wrapper">
        <div className="ngl-scene" style={{ height: "100vh", width: "100%", border: "3px solid black" }} ref={node => this.nglScene = node} />
      </div>
    );
  }
}

export default NGLScene;