git config --global pack.windowMemory "100m"
git config --global pack.packSizeLimit "100m"
git config --global pack.threads "1"
git repack -a -d --depth=250 --window=250
git push origin main


git config --global http.postBuffer 524288000


That sets the buffer to 500 MB, plenty for an 8 MB push.

You can also add:

git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999