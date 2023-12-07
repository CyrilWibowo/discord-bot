const fs = require('fs');

////////////////////////////////////////////////////////////////////////////////
//////////////////////////// DEFAULT COMMANDS //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const commandNew = {
  name:  'new',
  description: 'Create a new command or list',
  numOptions: 0,
  options: [],
  numSubcommands: 2,
  subcommands: [
    {
      name: 'command',
      description: 'Create a new command',
      numOptions: 3,
      options: [
        {
          type: 'string',
          name: 'name',
          description: 'Name of the command you are creating',
          required: true
        },
        {
          type: 'string',
          name: 'description',
          description: 'Description of the command you are creating',
          required: true
        },
        {
          type: 'string',
          name: 'output',
          description: 'The output of the command you are creating',
          required: true
        }
      ]
    },
    {
      name: 'list',
      description: 'Create a new list',
      numOptions: 2,
      options: [
        {
          type: 'string',
          name: 'name',
          description: 'Name of the list you are creating',
          required: true
        },
        {
          type: 'string',
          name: 'description',
          description: 'Description of the list you are creating',
          required: true
        },
        {
          type: 'string',
          name: 'output',
          description: 'Items you are putting in the list. For multiple items' +
          'separate them by a $ (i1$i2$i3)',
          required: true
        }
      ]
    }
  ],
  output: ''
}

const commandDelete = {
  name: 'delete',
  description: 'Deletes commands or lists',
  numOptions: 0,
  options: [],
  numSubcommands: 2,
  subcommands: [
    {
      name: 'command',
      description: 'Deletes user created commands',
      numOptions: 1,
      options: [
        {
          type: 'string',
          name: 'names',
          description: 'Type a command name or for multiple separate with' + 
          '$ to delete multiple commands (c1$c2) or type ALL',
          required: true
        }
      ]
    },
    {
      name: 'list',
      description: 'Deletes user created lists',
      numOptions: 1,
      options: [
        {
          type: 'string',
          name: 'names',
          description: 'Type a list name or for multiple separate with' + 
          '$ to delete multiple commands (c1$c2) or type ALL',
          required: true
        }
      ]
    }
  ],
  output: ''
}

const edit_command = {
  name: 'edit_command',
  description: 'Edits properties of a command',
  numOptions: 0,
  options: [],
  numSubcommands: 3,
  subcommands: [
    {
      name: 'name',
      description: 'Changes the name of a user made command',
      numOptions: 2,
      options: [
        {
          type: 'string',
          name: 'command',
          description: 'The name of the command you are changing',
          required: true
        },
        {
          type: 'string',
          name: 'new_name',
          description: 'The new name of the command you are changing',
          required: true
        }
      ]
    },
    {
      name: 'description',
      description: 'Changes the description of a user made command',
      numOptions: 2,
      options: [
        {
          type: 'string',
          name: 'command',
          description: 'The name of the command you are changing',
          required: true
        },
        {
          type: 'string',
          name: 'new_description',
          description: 'The new description of the command you are changing',
          required: true
        }
      ]
    },
    {
      name: 'output',
      description: 'Changes the output of a user made command',
      numOptions: 2,
      options: [
        {
          type: 'string',
          name: 'command',
          description: 'The name of the command you are changing',
          required: true
        },
        {
          type: 'string',
          name: 'new_output',
          description: 'The new output of the command you are changing',
          required: true
        }
      ]
    }
  ],
  output: ''
}

const edit_list = {

}

const commandShow = {

}

const commandRoll = {
  
}

const commandRoulette = {
  name: 'roulette',
  description: 'Play a ban/kick/timeout roulette with a given role',
  numOptions: 0,
  options: [],
  numSubcommands: 3,
  subcommands: [
    {
      name: 'ban',
      description: 'Play a ban roulette with a given role',
      numOptions: 1,
      options: [
        {
          type: 'string',
          name: 'role',
          description: 'The role playing the roulette',
          required: true
        },
      ]
    },
    {
      name: 'kick',
      description: 'Play a kick roulette with a given role',
      numOptions: 1,
      options: [
        {
          type: 'string',
          name: 'role',
          description: 'The role playing the roulette',
          required: true
        },
      ]
    },
    {
      name: 'timeout',
      description: 'Play a timeout roulette with a given role',
      numOptions: 1,
      options: [
        {
          type: 'string',
          name: 'role',
          description: 'The role playing the roulette',
          required: true
        },
      ]
    }
  ],
  output: ''
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const getData = () => {
  const data = fs.readFileSync('./data.json');
  return JSON.parse(data);
};

const setData = (newData) => {
  const data = JSON.stringify(newData);
  fs.writeFileSync('./data.json', data);
};

const clear = () => {
  const data = {
    commands: {
      utility: [commandNew, commandDelete, edit_command],
      fun: [commandRoulette],
      user: []
    },
    lists: [],
    choices: {
      commandsUtility: ['new', 'delete', 'echo', 'edit_command'],
      commandFun: ['roulette'],
      commandsUser: [],
      lists: []
    },
    members: [],
    roles: [],
  };
  setData(data);
}

// clear();
module.exports = { getData, setData, clear }