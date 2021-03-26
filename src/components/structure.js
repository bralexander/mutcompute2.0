import React from "react"
import NGLScene from "./nglScene"


const methylases = [
    { name: 'MLL1', id: '2w5z', uniprotId: 'Q03164' },
    { name: 'MLL3', id: '5f59', uniprotId: 'Q8NEZ4' },
    { name: 'MLL4', id: '4z4p', uniprotId: 'O14686' },
    { name: 'MLL5', id: '5ht6', uniprotId: 'Q8IZD2' },
    { name: 'SMYD1', id: '3n71', uniprotId: 'Q8NB12' },
    { name: 'SMYD2', id: '5wcg', uniprotId: 'Q9NRG4' },
    { name: 'SMYD3', id: '3qwp', uniprotId: 'Q9H7B4' },
    { name: 'G9a', id: '5tuy', uniprotId: 'Q96KQ7' },
    { name: 'GLP', id: '3swc', uniprotId: 'O88508' },
    { name: 'EZH2', id: '4mi5', uniprotId: 'Q15910' },
    { name: 'PRDM2', id: '2jv0', uniprotId: 'Q13029' },
    { name: 'PRDM9', id: '4c1q', uniprotId: 'P68431' },
    { name: 'ASH1L', id: '4ynm', uniprotId: 'Q9NR48' },
    { name: 'SETD2', id: '5v21', uniprotId: 'Q9BYW2' },
    { name: 'SETD7', id: '3m53', uniprotId: 'Q8WTS6' },
    { name: 'SETD8', id: '1zkk', uniprotId: 'P62805' },
    { name: 'SUV420H1', id: '3s8P', uniprotId: 'Q4FZB7' },
    { name: 'SUV420H2', id: '4au7', uniprotId: 'Q86Y97' },
    { name: 'NSD1', id: '3ooi', uniprotId: 'Q96L73' },
	];


class Structure extends React.Component {
	state = {
		structure: methylases[0],
		entry: {},
		representation: "cartoon",
		ligandRepresentation: "licorice",
		backgroundColor: "white",
		ligandMode: false,
		showContacts: false,
		reducedProteinOpacity: true,

		selection: {
			regionIndex: null,
			start: '',
			end: '',
		}
	}

    render() {
        return (
            <div>
            <NGLScene 
								height={500}
								width={600}
								pdbId={this.state.structure.id}
								representation={this.state.representation}
								ligandRepresentation={this.state.ligandRepresentation}
								backgroundColor={this.state.backgroundColor}
								showContacts={this.state.showContacts}
								selection={this.state.selection}
								ligandPocketOnly={this.state.ligandMode}
							/>
            </div>
             )
            }
          }

export default Structure