# Add this to your ~/.zshrc or ~/.bash_profile:
# alias showmeal="bash ~/.openclaw/workspace/projects/al-does-ai/showmeal"
#
# Or for a more permanent solution, symlink to /usr/local/bin:
# sudo ln -s ~/.openclaw/workspace/projects/al-does-ai/showmeal /usr/local/bin/showmeal

export ALDOESAI_DIR="$HOME/.openclaw/workspace/projects/al-does-ai"
alias showmeal="cd $ALDOESAI_DIR && ./showmeal"
alias aldocs="cd $ALDOESAI_DIR"
alias algit="cd $ALDOESAI_DIR && git status"
